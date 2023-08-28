import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger();
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // first we pick up the cookie from the request
    const token =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!token) {
      return false;
    }

    // here we get the roles that required to execute the request from handler
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    // then we create an RPC call to the auth service with the token
    return this.authClient
      .send("authenticate", {
        Authentication: token,
      })
      .pipe(
        tap((res) => {
          // here we check if any role specified
          if (roles) {
            // if it's we loop through the required roles
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                // if role is not available in user's roles we return Unauthorized
                this.logger.error("The user doesn't have valid roles.");
                throw new UnauthorizedException();
              }
            }
          }

          // then we put the user data to the request
          context.switchToHttp().getRequest().user = res;
        }),
        // if no error occurs we return true because authentication happened succesfully
        map(() => true),
        // any error occurs we return false so it doesn't pass
        catchError((error) => {
          this.logger.error(error.message);
          return of(false);
        }),
      );
  }
}
