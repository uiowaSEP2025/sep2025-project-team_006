// __tests__/LikeButton.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "@/components/LikeButton";
import { apiPUT } from "@/api/apiMethods";
import '@testing-library/jest-dom';

jest.mock("@/api/apiMethods", () => ({
  apiPUT: jest.fn(),
}));

describe("LikeButton", () => {
  const mockReviewId = 123;
  const mockUrl = "/api/review/:id/like";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct initial state", () => {
    const { getByRole } = render(
      <LikeButton reviewId={mockReviewId} initialLiked={false} updateUrl={mockUrl} />
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute("title", "Like");
    expect(button).toHaveClass("text-gray-400");
  });

  it("displays filled heart when liked", () => {
    const { getByRole } = render(
      <LikeButton reviewId={mockReviewId} initialLiked={true} updateUrl={mockUrl} />
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute("title", "Unlike");
    expect(button).toHaveClass("text-red-500");
  });

  it("toggles like on click and calls apiPUT with correct params", async () => {
    (apiPUT as jest.Mock).mockResolvedValue({ success: true });

    const onToggle = jest.fn();

    const { getByRole } = render(
      <LikeButton
        reviewId={mockReviewId}
        initialLiked={false}
        updateUrl={mockUrl}
        onToggle={onToggle}
      />
    );

    const button = getByRole("button");
    fireEvent.click(button);

    expect(apiPUT).toHaveBeenCalledWith(
      mockUrl,
      mockReviewId.toString(),
      JSON.stringify({ liked: true })
    );

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(true);
    });

    expect(button).toHaveClass("text-red-500");
  });

  it("does not update liked state on API failure", async () => {
    (apiPUT as jest.Mock).mockResolvedValue({ success: false });

    const onToggle = jest.fn();

    const { getByRole } = render(
      <LikeButton
        reviewId={mockReviewId}
        initialLiked={false}
        updateUrl={mockUrl}
        onToggle={onToggle}
      />
    );

    const button = getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(onToggle).not.toHaveBeenCalled();
    });

    expect(button).toHaveClass("text-gray-400");
  });

  it("disables the button while loading", async () => {
    let resolve: any;
    (apiPUT as jest.Mock).mockImplementation(
      () => new Promise((res) => (resolve = res))
    );

    const { getByRole } = render(
      <LikeButton reviewId={mockReviewId} initialLiked={false} updateUrl={mockUrl} />
    );

    const button = getByRole("button");
    fireEvent.click(button);
    expect(button).toBeDisabled();

    resolve({ success: true });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
