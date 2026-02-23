import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

// Custom render wrapper for components that need providers
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
  });
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };
