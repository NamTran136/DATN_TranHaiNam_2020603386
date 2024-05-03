import { jwtDecode } from "jwt-decode";
import { UserDto } from "../types";
import _ from "lodash";

export function GetUser(token: string | null) {
  let user: UserDto = {
    username: "",
    email: "",
    role: "",
    image: "",
  };
  if (token === null) {
    return user;
  } else {
    const decodedToken = jwtDecode<UserDto>(token);
    user.username = decodedToken?.username;
    user.email = decodedToken?.email;
    user.role = decodedToken?.role;
    user.image = decodedToken?.image;
    return user;
  }
}

export const returnPaginationRange = (totalPage: number,page: number, limit: number, siblings: number) => {
  let totalPageNoInArray = 7 + siblings;
  if(totalPageNoInArray >= totalPage) {
    return _.range(1, totalPage + 1);
  }

  let leftSiblingsIndex = Math.max(page - siblings, 1);
  let rightSiblingsIndex = Math.max(page + siblings, 1);
  let showLeftDots = leftSiblingsIndex > 2;
  let showRightDots = rightSiblingsIndex < totalPage - 2;

  if(!showLeftDots && showRightDots){
    let leftItemCount = 3 + 2*siblings;
    let leftRange = _.range(1, leftItemCount + 1);
    return [...leftRange, " ...", totalPage];
  } else if(showLeftDots && !showRightDots) {
    let rightItemCount = 3 + 2 * siblings;
    let rightRange = _.range(totalPage - rightItemCount + 1, totalPage + 1);
    return [1, "... ", ...rightRange];
  } else {
    let middleRange = _.range(leftSiblingsIndex, rightSiblingsIndex + 1);
    return [1, "... ", ...middleRange, " ...", totalPage];
  }
};