import { INestApplication } from "@nestjs/common";

// here we get the Nest Application we are running
export let app: INestApplication;

export const setApp = (_app: INestApplication) => {
  app = _app;
};
