import Image from "next/image";

function ProfileSummary() {
  return (
    <section className="py-4">
      <article className="wrapper grid grid-cols-[auto_1fr] gap-4">
        <figure className="">
          <Image
            src="https://i.pinimg.com/1200x/ff/02/39/ff02397557d58cfcf8d8529fc152c62e.jpg"
            alt="Clover from totally spies"
            width="70"
            height="70"
            className="rounded-full object-cover"
          />
        </figure>

        <div>
          <h2 className="font-bold text-xl">Alex</h2>
          <p>totally spy!</p>
          <div className="flex items-center gap-1">
            <p className="font-semibold">39 followers</p>
            &#xb7;
            <p className="font-semibold">92 following</p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
