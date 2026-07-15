import { CourseCard } from "@/components/courses/CourseCard";
import { fakeCourses } from "@/data/fakeCourses";

export default function CoursesPage() {
  return (
    <div>
      <h1 className="text-2xl pb-2">Khóa học</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
        {fakeCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}
