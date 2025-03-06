import { redirect } from "next/navigation";

export function POST() {
  redirect("/redirect-target");
}
