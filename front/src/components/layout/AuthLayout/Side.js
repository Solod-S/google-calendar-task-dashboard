import React, { cloneElement } from "react";
import { Avatar } from "components/ui";
import Logo from "components/template/Logo";
import { APP_NAME } from "constants/app.constant";

const Side = ({ children, content, ...rest }) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
        style={{ backgroundImage: `url('/img/others/auth-side-bg.jpg')` }}
      >
        <Logo mode="dark" />
        <div>
          <div className="mb-6 flex items-center gap-4">
            <Avatar
              className="border-2 border-white"
              shape="circle"
              src="/img/avatars/calendar_icon.png"
            />
            <div className="text-white">
              <div className="font-semibold text-base">
                Armors Telegram Calendar UI
              </div>
              <span className="opacity-80">Simplify Your Workflow</span>
            </div>
          </div>
          <p className="text-lg text-white opacity-80">
            Effortlessly manage and schedule your Telegram bot posts using the
            power of Google Calendar. Our intuitive admin panel is designed to
            streamline your posting process, allowing you to focus on what
            matters most - engaging with your team.
          </p>
        </div>
        <span className="text-white">
          Copyright &copy; {`${new Date().getFullYear()}`}{" "}
          <span className="font-semibold">{`${APP_NAME}`}</span>{" "}
        </span>
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
      </div>
    </div>
  );
};

export default Side;
