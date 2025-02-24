import { motion } from "framer-motion";
import { FiGithub, FiTwitter, FiBook, FiCoffee } from "react-icons/fi";

const Footer = () => {
  const links = [
    { icon: <FiGithub />, href: "https://github.com", label: "GitHub" },
    { icon: <FiTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FiBook />, href: "#docs", label: "Docs" },
    { icon: <FiCoffee />, href: "#support", label: "Support" },
  ];

  return (
    <footer className="relative border-t border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex gap-6"
          >
            {links.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-[#009933] transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="sr-only">{link.label}</span>
                {link.icon}
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-sm text-gray-400">
              Built with <span className="text-[#009933]">♦</span> by{" "}
              <a
                href="#"
                className="text-[#009933] hover:text-gray-200 transition-colors duration-200"
              >
                TokenFlowzy
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
