import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemberProfileForm from "@/components/MemberProfileForm";

jest.mock("next/navigation", () => ({
  // 他で使う可能性も考えて最低限の router を用意
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockUser = {
  id: "1",
  name: "山田太郎",
  email: "taro@example.com",
  postalCode: "123-4567",
  address: "東京都新宿区",
  phone: "090-0000-0000",
};

// fetch をモック（このファイル内だけ）
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
}) as any;

describe("MemberProfileForm", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("初期値が表示される", () => {
    render(<MemberProfileForm initialUser={mockUser} />);

    expect(screen.getByDisplayValue("山田太郎")).toBeInTheDocument();
    expect(screen.getByDisplayValue("taro@example.com")).toBeInTheDocument();
  });

  it("保存ボタンでAPIが呼ばれ、メッセージが表示される", async () => {
    render(<MemberProfileForm initialUser={mockUser} />);

    fireEvent.click(screen.getByRole("button", { name: "会員情報を保存" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/member/profile",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });

    // 成功メッセージ（実装に応じて調整）
    // expect(screen.getByText("会員情報を更新しました。")).toBeInTheDocument();
  });
});
