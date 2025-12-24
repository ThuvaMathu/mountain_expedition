"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    once?: boolean;
}

export const FadeIn = ({
    children,
    className = "",
    delay = 0,
    duration = 0.8, // Increased from 0.5
    once = true
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once, margin: "-100px" }} // Trigger earlier
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </motion.div>
    );
};

export const SlideUp = ({
    children,
    className = "",
    delay = 0,
    duration = 0.8, // Increased from 0.5
    once = true
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }} // Increased from 30
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-100px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </motion.div>
    );
};

export const SlideRight = ({
    children,
    className = "",
    delay = 0,
    duration = 0.8,
    once = true
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -60 }} // Increased from -30
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once, margin: "-100px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </motion.div>
    );
};

export const ScaleIn = ({
    children,
    className = "",
    delay = 0,
    duration = 0.8,
    once = true
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once, margin: "-100px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({
    children,
    className = "",
    delay = 0,
    once = true,
    as: Component = "div"
}: { children: React.ReactNode, className?: string, delay?: number, once?: boolean, as?: React.ElementType }) => {
    const MotionComponent = motion(Component as any);
    return (
        <MotionComponent
            initial="hidden"
            whileInView="show"
            viewport={{ once, margin: "-100px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.15, // Slightly slower stagger
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </MotionComponent>
    );
};

export const StaggerItem = ({ children, className = "", as: Component = "div" }: { children: React.ReactNode, className?: string, as?: React.ElementType }) => {
    const MotionComponent = motion(Component as any);
    return (
        <MotionComponent
            variants={{
                hidden: { opacity: 0, y: 40 }, // Increased from 20
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }, // Increased duration
            }}
            className={className}
            style={{ willChange: "opacity, transform" }}
        >
            {children}
        </MotionComponent>
    );
};
