import { toast } from "@/components/ui/use-toast";

export const EMAIL = "dltjdgh0928@naver.com";

// 메일 앱을 띄우지 않고 주소만 복사
export const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast({ title: "이메일 주소를 복사했어요", description: EMAIL });
  } catch {
    toast({ title: "이메일 주소", description: EMAIL });
  }
};
