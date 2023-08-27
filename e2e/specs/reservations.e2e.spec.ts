describe("Reservations", () => {
  beforeAll(async () => {
    const user = { email: "me@here.com", password: "Aa12345!" };
    const signUpRes = await fetch(
      "http://auth-microservice:8001/api/v1/users",
      {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const signUpResBody = await signUpRes.json();
    console.log("body:\n", signUpResBody);
    console.log("status code: \n", signUpRes.status);

    expect(signUpRes.ok).toBeTruthy();

    const signInRes = await fetch(
      "http://auth-microservice:8001/api/v1/users",
      {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(signInRes.ok).toBeTruthy();

    const jwt = await signInRes.text();
    console.log(jwt);
  });
  test("Create", () => {
    expect(true).toBeTruthy();
  });
});
