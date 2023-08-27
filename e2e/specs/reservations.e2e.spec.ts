describe("Reservations", () => {
  let jwt: string;
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

    expect(signUpRes.ok).toBeTruthy();

    const signInRes = await fetch("http://auth-microservice:8001/api/v1/auth", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    jwt = await signInRes.text();
    expect(signInRes.ok).toBeTruthy();
  });

  test("Create & Get", async () => {
    const reservationToCreate = {
      startDate: "09/19/23",
      endDate: "09/24/23",
      placeId: "258",
      charge: {
        amount: 19,
        card: {
          cvc: "424",
          number: "4242424242424242",
          expYear: 2027,
          expMonth: 4,
        },
      },
    };

    const createRes = await fetch(
      "http://reservations-microservice:8000/api/v1/reservations",
      {
        method: "POST",
        body: JSON.stringify(reservationToCreate),
        headers: {
          "Content-Type": "application/json",
          authentication: jwt,
        },
      },
    );

    expect(createRes.ok).toBeTruthy();

    const createResBody = await createRes.json();

    const getRes = await fetch(
      `http://reservations-microservice:8000/api/v1/reservations/${createResBody._id}`,
      {
        headers: {
          authentication: jwt,
        },
      },
    );

    expect(getRes.ok).toBeTruthy();

    const getResBody = await getRes.json();

    expect(getResBody).toEqual(createResBody);
  });
});
