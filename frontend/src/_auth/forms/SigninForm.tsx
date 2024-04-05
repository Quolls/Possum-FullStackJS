/**
 * 创建了一个登录表单，
 * 使用zod进行数据验证，
 * 利用react-hook-form管理表单状态，
 * 通过react-query管理API请求，
 * 并使用react-router-dom进行页面导航。
 */

// 引入zod库用于数据验证
import * as z from "zod";
// 引入react-hook-form库中的useForm钩子用于表单管理
import { useForm } from "react-hook-form";
// 引入@hookform/resolvers/zod库中的zodResolver用于集成zod与react-hook-form

import { zodResolver } from "@hookform/resolvers/zod";
// 引入react-router-dom库中的Link和useNavigate钩子用于导航
import { Link, useNavigate } from "react-router-dom";

// 引入自定义UI组件
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// 引入共享Loader组件
import Loader from "@/components/shared/Loader";
// 引入自定义toast通知钩子
import { useToast } from "@/components/ui/use-toast";
// 引入登录验证规则
import { SigninValidation } from "@/lib/validation";
// 引入使用signInAccount查询的钩子
import { useSignInAccount } from "@/lib/react-query/queries";
// 引入用户上下文钩子
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  // 使用toast通知
  const { toast } = useToast();
  // 使用导航钩子
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // 使用signInAccount查询 （React Query）
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  // 设置表单初始状态和验证规则
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * 处理登录逻辑
   *
   * @param {z.infer<typeof SigninValidation>} user - the user object to sign in
   * @return {void}
   */
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    // 登录账户 （React Query）
    const session = await signInAccount(user);

    // 登录失败通知
    if (!session) {
      toast({ title: "Login failed. Please try again." });
      return;
    }

    // 检查用户登录状态
    const isLoggedIn = await checkAuthUser();

    // 重置表单
    if (isLoggedIn) {
      form.reset();

      // 导航到首页
      navigate("/");
    } else {
      // 登录失败通知
      toast({ title: "Login failed. Please try again." });

      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isLoading || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

// 导出SigninForm组件
export default SigninForm;
