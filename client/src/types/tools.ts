import { jwtDecode } from "jwt-decode";
import { UserDto } from ".";

export function GetUser(token: string | null) {
    let user : UserDto = {
        username: "",
        email: "",
        role: "",
        image: ""
    };
    if(token === null) {
        return user;
    }
    else {
        const decodedToken = jwtDecode<UserDto>(token);
        user.username = decodedToken?.username;
        user.email = decodedToken?.email;
        user.role = decodedToken?.role;
        user.image = decodedToken?.image;
        return user;
    }
}