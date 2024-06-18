"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-950">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-60 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          SwiftScribe
        </motion.h1>
      </LampContainer>

      <ContainerScroll titleComponent={<></>}>
        <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>

      <div className="flex place-content-evenly -mt-60">
        <CardContainer className="inter-var w-72">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-lg max-w-sm mt-2 dark:text-neutral-300"
            >
              Hobby
            </CardItem>
            <CardItem
              translateZ="50"
              className="text-2xl font-bold text-neutral-600 dark:text-white"
            >
              0$
            </CardItem>

            <CardItem translateZ="100" className="w-full my-2">
              <div className="flex flex-col text-sm">
              <span className="dark:text-white">
                Perfect for starting out
              </span>
              </div>
            </CardItem>
            <CardItem>
              <div className="text-white text-sm mb-2">
                <ul>✅ 50 emails per month</ul>
                <ul>❌ Custom design template</ul>
                <ul></ul>
              </div>
            </CardItem>
            <div className="flex justify-between items-center">
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                <Link href='/sign-in'>Sign in</Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>

        <CardContainer className="inter-var w-72">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-lg max-w-sm mt-2 dark:text-neutral-300"
            >
              Professionalism
            </CardItem>
            <CardItem
              translateZ="50"
              className="text-2xl font-bold text-neutral-600 dark:text-white"
            >
              49$
            </CardItem>

            <CardItem translateZ="100" className="w-full my-2">
              <div className="flex flex-col text-sm">
              <span className="dark:text-white">
                Perfect for professional use
              </span>
              </div>
            </CardItem>
            <CardItem>
              <div className="text-white text-sm mb-2">
                <ul>✅ Unlimited emails</ul>
                <ul>✅ Custom design template</ul>
                <ul></ul>
              </div>
            </CardItem>
            <div className="flex justify-between items-center">
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                Get Started
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </div>
  );
}
