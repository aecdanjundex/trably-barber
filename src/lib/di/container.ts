import "reflect-metadata";
import { Container } from "inversify";

const container = new Container();

// Register your bindings here, e.g.:
// container.bind<IUserService>(TYPES.UserService).to(UserService);

export { container };
