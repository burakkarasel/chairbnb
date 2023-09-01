import { UnauthorizedException } from "@nestjs/common";
import { app } from "./app";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "@app/common";
import { lastValueFrom } from "rxjs";

export const authContext = async ({ req }) => {
  try {
    // here we used the Initialized app
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    // here we make a request to authClient
    const user = await lastValueFrom(
      authClient.send("authenticate", {
        Authentication: req.headers?.authentication,
      }),
    );
    // then return the user
    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
