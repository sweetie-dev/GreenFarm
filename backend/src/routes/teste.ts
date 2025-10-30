import type Express from "express";

const testeRoutes = [
    {
        endpoint: "/teste",
        method: "get",

        run: async (_: any, res: Express.Response) => {
            res.send("Olá mundo");
        }
    }
]

export default testeRoutes;