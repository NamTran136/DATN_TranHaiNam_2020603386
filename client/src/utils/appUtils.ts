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
export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function Now() {
  // Lấy thời gian hiện tại
  var now = new Date();

  // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
  var day = now.getDate();
  var month = now.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
  var year = now.getFullYear();
  var hours = now.getHours();
  var minutes = now.getMinutes();

  // Định dạng lại chuỗi theo yêu cầu "dd/MM/yyyy hh:ss"
  var formattedDate =
    ("0" + day).slice(-2) +
    "/" +
    ("0" + month).slice(-2) +
    "/" +
    year +
    " " +
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2);
    return formattedDate;
}

export function TimeString() {
  const date = new Date(); // or any other date object
  const dateString = date.toLocaleString(); 
  return dateString;
}

export const getRandomNumber = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

export function hasImageExtension(fileName: string): boolean {
  return fileName.endsWith(".jpg") || fileName.endsWith(".png");
}