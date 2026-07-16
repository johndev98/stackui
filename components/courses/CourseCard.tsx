"use client";

import { CourseCardProps } from "@/types/course";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function CourseCard({
  thumbnail,
  title,
  description,
  oldPrice,
  price,
  students,
  maxOnline,
  slug,
}: CourseCardProps) {
  const discount =
    oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  return (
    <motion.div
      whileHover={{
        scale: 1.025,
        borderColor: "var(--primary)",
      }}
      transition={{ duration: 0.3 }}
      className="flex w-full min-h-93.75 max-w-2xs min-w-3xs flex-col  border-dotted border-2 border-transparent overflow-hidden rounded-xl bg-(--card-bg) select-none "
    >
      {/* Ảnh */}
      <div className="p-1">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          {price > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.2 }}
              className="absolute top-2 right-2 z-10 rounded-lg bg-red-600 px-2 py-0.5 text-sm font-bold"
            >
              -{discount}%
            </motion.span>
          )}

          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full relative "
          >
            <Image
              src={thumbnail}
              alt={title}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </motion.div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col px-3 pb-3 ">
        <div className="flex-1 mt-1">
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>

          <p className="text-content line-clamp-2 text-sm">{description}</p>
        </div>

        <div className="text-content flex items-center justify-between text-sm mb-2">
          <span>👥 {students.toLocaleString("vi-VN")} đã đăng ký</span>
          <span>📺 {maxOnline.toLocaleString("vi-VN")} đang học</span>
        </div>

        <hr className="border-neutral-700" />

        {/* Footer luôn nằm dưới */}
        <div className="flex justify-between">
          <div>
            <span
              className={`text-content text-md line-through ${oldPrice === 0 ? "invisible" : ""}`}
            >
              {oldPrice > 0 ? `${oldPrice.toLocaleString("vi-VN")}đ` : "\u00A0"}
            </span>

            <div className="text-xl font-bold">
              {price === 0 ? "Miễn phí" : `${price.toLocaleString("vi-VN")}đ`}
            </div>
          </div>

          <Link href={`/courses/${slug}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-heading hover:text-page-bg self-end rounded-lg border p-2 cursor-pointer"
            >
              Xem thêm
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
