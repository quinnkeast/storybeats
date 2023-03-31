import { supabase } from "@lib/supabaseClient";
import { useRouter } from "next/router";

function Story({ story }) {
  return <p>{story.title ? story.title : "Not found"}</p>;
}

export async function getServerSideProps() {
  const { pid } = router.query;
  let { data } = await supabase.from("stories").select(pid);

  return {
    props: {
      story: data,
    },
  };
}

export default Page;
