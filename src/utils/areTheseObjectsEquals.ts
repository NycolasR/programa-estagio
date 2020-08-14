export default function areTheseObjectsEquals(object1: any, object2: any) {
  // Converte ambos objetos para string e as compara
  return JSON.stringify(object1) === JSON.stringify(object2);
}
