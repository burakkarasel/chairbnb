import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AUTH_SERVICE, LoggerModule } from "@app/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { authContext } from "./auth.context";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        // here we specify graphql to make auth request whenever a new request sent
        server: {
          context: authContext,
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: "reservations-microservice",
                url: configService.getOrThrow("RESERVATIONS_GRAPHQL_URL"),
              },
              {
                name: "auth-microservice",
                url: configService.getOrThrow("AUTH_GRAPHQL_URL"),
              },
              {
                name: "notifications-microservice",
                url: configService.getOrThrow("NOTIFICATIONS_GRAPHQL_URL"),
              },
              {
                name: "payments-microservice",
                url: configService.getOrThrow("PAYMENTS_GRAPHQL_URL"),
              },
            ],
          }),
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              // willSendRequest will check the context
              // if it's passed the authContext there will be a user attached to our context
              // and it will attach the user to request headers
              willSendRequest({ request, context }) {
                request.http.headers.set(
                  "user",
                  context.user ? JSON.stringify(context.user) : null,
                );
              },
            });
          },
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
            queue: "auth",
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
