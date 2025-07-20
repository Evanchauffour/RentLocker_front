"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "../ui/datePicker";
import dayjs from "dayjs";
import { createCheckoutSession } from "@/actions/payments";
import { toast } from "react-toastify";
import { Locker } from "@/app/(admin)/administration/page";
import { CalendarClock, CreditCard, Key } from "lucide-react";

export default function BookLockerDialog({
	isOpen = false,
	onOpenChange,
	startDate,
	endDate,
	locker,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	startDate: string;
	endDate: string;
	locker: Locker | null;
}) {
	const [loading, setLoading] = useState(false);
	const [selectedStartDate, setSelectedStartDate] = useState<Date>(
		dayjs(startDate).toDate()
	);
	const [selectedEndDate, setSelectedEndDate] = useState<Date>(
		dayjs(endDate).toDate()
	);

	// Réinitialiser les dates sélectionnées quand le locker change
	React.useEffect(() => {
		if (locker) {
			setSelectedStartDate(dayjs(startDate).toDate());
			setSelectedEndDate(dayjs(endDate).toDate());
		}
	}, [locker, startDate, endDate]);

	const numberOfDays = useMemo(() => {
		const diffTime = Math.abs(
			selectedEndDate.getTime() - selectedStartDate.getTime()
		);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays + 1;
	}, [selectedStartDate, selectedEndDate]);

	const totalPrice = useMemo(() => {
		if (locker?.price === null || locker?.price === undefined) return 0;
		return locker.price * numberOfDays;
	}, [locker?.price, numberOfDays]);

	// Les dates sont toujours fixes pour les casiers disponibles
	const fromDate = undefined;
	const toDate = undefined;

	const handlePayment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!locker) return;

		try {
			setLoading(true);

			const result = await createCheckoutSession({
				lockerId: locker._id,
				startDate: dayjs(selectedStartDate).format("YYYY-MM-DD"),
				endDate: dayjs(selectedEndDate).format("YYYY-MM-DD"),
				price: totalPrice,
				lockerName: locker.name,
				metadata: {
					lockerSize: locker.size,
					lockerPosition: `C${locker.colNumber} R${locker.rowNumber}`,
				},
			});

			if (result.success && result.url) {
				// Rediriger vers Stripe Checkout
				window.location.href = result.url;
			} else {
				toast.error(result.error || "Erreur lors de la création du paiement");
			}
		} catch (error) {
			console.error("Erreur lors du paiement:", error);
			toast.error("Erreur lors de la création du paiement");
		} finally {
			setLoading(false);
		}
	};

	if (!locker) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] p-0 overflow-hidden rounded-xl">
				<div className="bg-gradient-primary text-white p-6">
					<DialogHeader className="mb-4">
						<div className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							<DialogTitle>Réserver un casier</DialogTitle>
						</div>
						<DialogDescription className="text-white/90 mt-2">
							Confirmez les détails de votre réservation pour le casier{" "}
							<span className="font-semibold">{locker.name}</span>
						</DialogDescription>
					</DialogHeader>

					<div className="bg-white/10 rounded-lg p-3 flex justify-between text-sm">
						<div className="flex flex-col">
							<span className="opacity-75">Casier</span>
							<span className="font-semibold">{locker.name}</span>
						</div>
						<div className="flex flex-col">
							<span className="opacity-75">Position</span>
							<span className="font-semibold">
								C{locker.colNumber} R{locker.rowNumber}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="opacity-75">Taille</span>
							<span className="font-semibold">{locker.size}</span>
						</div>
						<div className="flex flex-col">
							<span className="opacity-75">Prix par jour</span>
							<span className="font-semibold">{locker.price}€</span>
						</div>
					</div>
				</div>

				<form onSubmit={handlePayment}>
					<div className="p-6">
						<div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
							<div className="bg-blue-100 p-2 rounded-full text-blue-600">
								<CalendarClock className="h-5 w-5" />
							</div>
							<div>
								<h3 className="font-medium text-gray-800 mb-1">
									Détails de la période
								</h3>
								<p className="text-sm text-gray-600">
									Votre réservation sera effective aux dates suivantes
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-6">
							<div>
								<DatePicker
									label="Date de début"
									initialDate={selectedStartDate}
									onDateChange={(date) => date && setSelectedStartDate(date)}
									fromDate={fromDate}
									toDate={toDate}
									disabled={true}
								/>
							</div>

							<div>
								<DatePicker
									label="Date de fin"
									initialDate={selectedEndDate}
									onDateChange={(date) => date && setSelectedEndDate(date)}
									fromDate={selectedStartDate}
									toDate={toDate}
									disabled={true}
								/>
							</div>
						</div>

						<div className="bg-gray-50 p-4 rounded-lg">
							<div className="flex justify-between mb-2">
								<span className="text-gray-600">Durée</span>
								<span className="font-medium">{numberOfDays} jour(s)</span>
							</div>
							<div className="flex justify-between text-lg">
								<span className="font-semibold">Total à payer</span>
								<span className="font-bold text-primary">
									{totalPrice.toFixed(2)}€
								</span>
							</div>
						</div>
					</div>

					<DialogFooter className="bg-gray-50 p-6 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="border-gray-300"
						>
							Annuler
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="bg-primary hover:bg-primary/90 btn-hover-effect flex items-center gap-2"
						>
							<CreditCard className="h-4 w-4" />
							{loading
								? "Redirection vers le paiement..."
								: "Procéder au paiement"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
