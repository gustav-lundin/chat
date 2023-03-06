async function fetchJson(route, method = "GET", body = {}) {
  try {
    const options =
      method === "GET"
        ? {}
        : {
            method,
            body: JSON.stringify(body),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          };
    const data = await (await fetch(`/api/${route}`, options)).json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

export { fetchJson };
