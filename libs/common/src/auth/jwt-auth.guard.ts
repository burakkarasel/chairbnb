import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
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
    // then we create an RPC call to the auth service with the token
    return this.authClient
      .send("authenticate", {
        Authentication: token,
      })
      .pipe(
        tap((res) => {
          // then we put the user data to the request
          context.switchToHttp().getRequest().user = res;
        }),
        // if no error occurs we return true because authentication happened succesfully
        map(() => true),
        // any error occurs we return false so it doesn't pass
        catchError(() => of(false)),
      );
  }
}
