import RandomString from "@/components/app/string/RandomStringGenerator";
import UuidGenerator from "@/components/app/string/UuidGenerator";


export default function Page() {
  return (
    <>
      <RandomString/>
      <UuidGenerator/>
    </>
  );
}