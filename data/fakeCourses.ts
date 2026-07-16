import type { CourseCardProps } from "@/types/course";

export function getCourseBySlug(slug: string) {
  return fakeCourses.find((c) => c.slug === slug);
}
export const fakeCourses: CourseCardProps[] = [
  {
    id: "course1",
    thumbnail:
      "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg",
    title: "TypeScript cơ bản",
    description: "Học TypeScript từ cơ bản đến thực chiến với React & Nextjs.",
    oldPrice: 0,
    price: 0,
    students: 1245,
    maxOnline: 328,
    slug: "typescript-co-ban",
    categories: ["programming", "frontend"],
  },
  {
    id: "course2",
    thumbnail:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    title: "ReactJS từ Zero đến Hero",
    description:
      "Nắm vững React hiện đại với Hooks, Context và thực hành dự án.",
    oldPrice: 799000,
    price: 0,
    students: 2156,
    maxOnline: 512,
    slug: "react-zero-to-hero",
    categories: ["frontend", "framework", "web-dev"],
  },
  {
    id: "course3",
    thumbnail:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    title: "Nextjs Fullstack",
    description: "Xây dựng ứng dụng Fullstack với Nextjs App Router.",
    oldPrice: 699000,
    price: 499000,
    students: 1890,
    maxOnline: 267,
    slug: "nextjs-fullstack",
    categories: ["frontend", "backend", "framework", "web-dev"],
  },
  {
    id: "course4",
    thumbnail:
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
    title: "JavaScript ES6+ Chuyên sâu với",
    description:
      "Làm chủ JavaScript hiện đại với ES6+, Async/Await và Design Pattern.",
    oldPrice: 799000,
    price: 349000,
    students: 3058,
    maxOnline: 645,
    slug: "javascript-es6-chuyen-sau",
    categories: ["programming", "frontend", "web-dev"],
  },
  {
    id: "course5",
    thumbnail:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
    title: "Tailwind CSS Master",
    description:
      "Xây dựng giao diện đẹp, responsive và tối ưu với Tailwind CSS.",
    oldPrice: 499000,
    price: 249000,
    students: 1724,
    maxOnline: 294,
    slug: "tailwind-css-master",
    categories: ["frontend", "framework", "web-dev"],
  },
  {
    id: "course6",
    thumbnail:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    title: "NodeJS & Express API",
    description: "Xây dựng RESTful API với Nodejs, Express và MongoDB từ đầu.",
    oldPrice: 899000,
    price: 449000,
    students: 2810,
    maxOnline: 431,
    slug: "nodejs-express-api",
    categories: ["backend", "database"],
  },
  {
    id: "course7",
    thumbnail:
      "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg",
    title: "Docker cho Developer",
    description:
      "Triển khai ứng dụng bằng Docker và Docker Compose trong thực tế.",
    oldPrice: 649000,
    price: 299000,
    students: 1387,
    maxOnline: 198,
    slug: "docker-cho-developer",
    categories: ["devops"],
  },
  {
    id: "course8",
    thumbnail:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    title: "Git & GitHub Thực chiến",
    description: "Quản lý mã nguồn chuyên nghiệp với Git, GitHub và Git Flow.",
    oldPrice: 399000,
    price: 199000,
    students: 4276,
    maxOnline: 702,
    slug: "git-github-thuc-chien",
    categories: ["devops", "tool"],
  },
];
