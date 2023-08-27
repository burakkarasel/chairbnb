import { ping } from "tcp-ping";

describe("Health", () => {
  test("Reservations", async () => {
    const res = await fetch("http://reservations-microservice:8000");
    expect(res.ok).toBeTruthy();
  });

  test("Auth", async () => {
    const res = await fetch("http://auth-microservice:8001");
    expect(res.ok).toBeTruthy();
  });

  test("Payments", (done) => {
    ping({ address: "http://payments-microservice:8003" }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test("Notifications", (done) => {
    ping({ address: "http://notifications-microservice:8004" }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });
});
