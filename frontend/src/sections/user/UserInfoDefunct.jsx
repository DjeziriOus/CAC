import Error from "@/components/ui/Error";
import SkeletonUser from "@/components/ui/SkeletonUser";
import { getUser } from "@/services/apiQuestions";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

function UserInfo() {
  let { userInfo } = useLoaderData();
  return (
    <div>
      <Suspense fallback={<SkeletonUser />}>
        <Await
          resolve={userInfo}
          errorElement={<Error errorMessage={"Failed to load user"} />}
        >
          {(userInfo) => <div>{userInfo.first_name}</div>}
        </Await>
      </Suspense>
    </div>
  );
}
export async function loader() {
  const userInfo = await getUser();
  return { userInfo };
}
export default UserInfo;
