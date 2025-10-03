import L from "leaflet";
import defaultPinImg from "../assets/icons/defaultPin.png";
import mainPinImg from "../assets/icons/mainPin.png";
import realUserPinImg from "../assets/icons/realUserPin.png";

export const mainPin = new L.Icon({
  iconUrl: mainPinImg.src,
  iconRetinaUrl: mainPinImg.src,
  iconSize: [38, 41],
  iconAnchor: [19, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export const realUserPin = new L.Icon({
  iconUrl: realUserPinImg.src,
  iconRetinaUrl: realUserPinImg.src,
  iconSize: [38, 41],
  iconAnchor: [19, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export const defaultPin = new L.Icon({
  iconUrl: defaultPinImg.src,
  iconRetinaUrl: defaultPinImg.src,
  iconSize: [38, 41],
  iconAnchor: [19, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});
