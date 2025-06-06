"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import AccountDialog from "./account-dialog";
import DeleteAccountDialog from "./delete-account-dialog";

interface AccountActionsProps {
	accountId: number;
	accountName: string;
}

export default function AccountActions({ accountId, accountName }: AccountActionsProps) {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => setEditDialogOpen(true)}
					>
						<Edit className="h-4 w-4" />
						Edit Account
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2 className="h-4 w-4" />
						Delete Account
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AccountDialog
				mode="edit"
				accountId={accountId}
				isOpen={editDialogOpen}
				onOpenChange={setEditDialogOpen}
			/>

			<DeleteAccountDialog
				accountId={accountId}
				accountName={accountName}
				isOpen={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</>
	);
}

