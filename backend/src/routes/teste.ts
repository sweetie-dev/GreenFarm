import type Express from "express";

const testeRoute = {
    endpoint: "/",
    method: "get",

    run: async (_: any, res: Express.Response) => {
        res.send("Olá mundo");
    }
}

export default testeRoute;