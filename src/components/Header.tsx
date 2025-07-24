"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();
	const { user, clearUser, isAuthenticated } = useUserStore();

	const handleLogout = async () => {
		try {
			await fetch("http://localhost:8000/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			clearUser();
			router.push("/sign-in");
			setIsMenuOpen(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/80 border-b border-gray-100 shadow-sm">
			<div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
				<Link href="/" className="flex items-center gap-2">
					<div className="bg-primary p-1 rounded-md">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
								fill="white"
							/>
							<path
								d="M14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"
								fill="white"
							/>
						</svg>
					</div>
					<span className="font-bold text-xl text-gray-800">RentLocker</span>
				</Link>

				<div className="relative">
					{isAuthenticated ? (
						<div className="flex items-center">
							<Button
								variant="ghost"
								className="flex items-center gap-2 mr-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/70"
								onClick={() => router.push("/")}
							>
								Accueil
							</Button>

							<div className="relative">
								<div
									className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
									onClick={() => setIsMenuOpen(!isMenuOpen)}
								>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.email}`}
											alt={user?.firstName}
										/>
										<AvatarFallback className="bg-primary text-white">
											{user
												? `${user.firstName.charAt(0)}${user.lastName.charAt(
														0
												  )}`
												: "U"}
										</AvatarFallback>
									</Avatar>
									<span className="font-medium text-sm hidden sm:inline">
										{user?.firstName}
									</span>
									<ChevronDown
										size={16}
										className={`transition-transform duration-200 ${
											isMenuOpen ? "rotate-180" : ""
										}`}
									/>
								</div>

								{isMenuOpen && (
									<div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100 animate-fadeIn">
										<div className="py-2 px-3 border-b border-gray-100">
											<p className="text-sm font-medium text-gray-900">
												{user?.firstName} {user?.lastName}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{user?.email}
											</p>
										</div>
										<div className="py-1">
											<Link href="/profile">
												<Button
													variant="ghost"
													className="w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700"
													onClick={() => setIsMenuOpen(false)}
												>
													<User size={16} className="mr-2" />
													Mon profil
												</Button>
											</Link>
											{user?.role === "admin" && (
												<Link href="/administration">
													<Button
														variant="ghost"
														className="w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700"
														onClick={() => setIsMenuOpen(false)}
													>
														<Settings size={16} className="mr-2" />
														Administration
													</Button>
												</Link>
											)}
										</div>
										<div className="py-1 border-t border-gray-100">
											<Button
												variant="ghost"
												className="w-full flex justify-start px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-500"
												onClick={handleLogout}
											>
												<LogOut size={16} className="mr-2" />
												Se déconnecter
											</Button>
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="flex gap-2">
							<Link href="/sign-up">
								<Button variant="outline" className="shadow-sm">
									S'inscrire
								</Button>
							</Link>
							<Link href="/sign-in">
								<Button className="bg-primary hover:bg-primary/90 shadow-sm">
									Se connecter
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
