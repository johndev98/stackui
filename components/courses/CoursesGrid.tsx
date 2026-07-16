"use client";

import { fakeCourses } from "@/data/fakeCourses";
import { CourseCard } from "./CourseCard";
import { useSearch } from "./context/SearchContext";
import { useEffect, useMemo, useState } from "react";
import { CourseCardProps } from "@/types/course";
import { AnimatePresence, motion } from "motion/react";
import CategoryDropdown from "./CategoryDropdown";
import FilterDropdown from "./FilterDropdown";

function searchCourses(q: string) {
  return fakeCourses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)),
    )
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q);
      const bTitle = b.title.toLowerCase().includes(q);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
}

function applyFilterAndSort(
  courses: CourseCardProps[],
  filter: string,
  sort: string,
  category: string | null,
) {
  let result = [...courses];

  if (filter === "free") result = result.filter((c) => c.price === 0);
  if (filter === "paid") result = result.filter((c) => c.price > 0);
  if (category) result = result.filter((c) => c.categories.includes(category)); // ← thêm dòng này

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      result.sort((a, b) => b.students - a.students);
      break;
  }

  return result;
}

export default function CoursesGrid() {
  const { search } = useSearch();
  const q = search.toLowerCase().trim();
  const isSearching = q.length >= 2;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = useMemo(
    () => [...new Set(fakeCourses.flatMap((c) => c.categories))].sort(),
    [],
  );
  const [filter, setFilter] = useState<"popular" | "free" | "paid">("popular");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc">(
    "popular",
  );

  // Auto-reset filter về "popular" khi search thay đổi
  useEffect(() => {
    setFilter("popular");
    setSort("popular");
    setSelectedCategory(null);
  }, [search]);

  const matched = isSearching ? searchCourses(q) : [];
  const matchedIds = new Set(matched.map((c) => c.id));

  const filteredMatched = useMemo(
    () => applyFilterAndSort(matched, filter, sort, selectedCategory),
    [matched, filter, sort, selectedCategory],
  );
  const filteredRemaining = useMemo(
    () =>
      isSearching
        ? applyFilterAndSort(
            fakeCourses.filter((c) => !matchedIds.has(c.id)),
            filter,
            sort,
            selectedCategory,
          )
        : applyFilterAndSort(fakeCourses, filter, sort, selectedCategory),
    [isSearching, matchedIds, filter, sort, selectedCategory],
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center flex-wrap justify-between mb-6">
        <CategoryDropdown
          categories={allCategories}
          value={selectedCategory}
          onChange={(cat) => {
            setSelectedCategory(cat);
            setFilter("popular");
            setSort("popular");
          }}
          align="left"
        />
        <FilterDropdown
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
      {isSearching &&
        filteredMatched.length === 0 &&
        filteredRemaining.length === 0 && (
          <p className="text-content py-10 text-center">
            Không tìm thấy khóa học cho &quot;{search}&quot;
          </p>
        )}
      {/* Matched results */}
      {filteredMatched.length > 0 && (
        <>
          <p className="text-content text-sm mb-4">
            {filteredMatched.length} kết quả cho &quot;{search}&quot;
          </p>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
              {filteredMatched.map((course) => (
                <motion.div
                  key={course.id}
                  // ✅ Đặt layout="position" để ưu tiên chuyển động vị trí, không giãn nội dung
                  layout="position"
                  // ✅ Tách riêng transition cho layout và cho hiện/ẩn
                  transition={{
                    // 🎨 Chuyển động khi thay đổi vị trí/kích thước (resize/wrap)
                    layout: {
                      type: "spring",
                      stiffness: 180, // giảm độ cứng để chậm hơn
                      damping: 28, // giảm chậm nhẹ nhàng
                      duration: 0.4, // đặt thời gian rõ ràng
                    },
                    // ✨ Chuyển động khi thêm/xóa phần tử
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                    y: { duration: 0.25 },
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -12 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          <hr className="border-neutral-700 my-10" />
        </>
      )}

      {/* Remaining - áp dụng chính xác như trên */}
      {filteredRemaining.length > 0 && (
        <>
          {isSearching && filteredMatched.length > 0 && (
            <p className="text-content text-sm mb-4">Tất cả khóa học</p>
          )}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,18rem))] justify-center gap-6">
              {filteredRemaining.map((course) => (
                <motion.div
                  key={course.id}
                  layout="position"
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 180,
                      damping: 28,
                      duration: 0.4,
                    },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                    y: { duration: 0.25 },
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -12 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
