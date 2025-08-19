/**
 * Utility function to combine class names.
 * This function filters out falsy values and joins the remaining classes.
 *
 * @param inputs - Class values to combine
 * @returns Combined class string
 *
 * @example
 * ```tsx
 * cn("base-class", condition && "conditional-class", "another-class")
 * // Output: "base-class conditional-class another-class"
 * ```
 */
export function cn(
  ...inputs: (string | boolean | undefined | null | number)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
