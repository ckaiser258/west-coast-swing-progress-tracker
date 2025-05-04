"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UserOption = {
    uid: string
    label: string
}

export function UserSelector({
    onSelect,
}: {
    onSelect: (userId: string) => void
}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [users, setUsers] = useState<UserOption[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"))
            const options = snapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    uid: data.uid,
                    label: data.displayName,
                }
            })

            // Sort alphabetically (case-insensitive)
            options.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }))

            setUsers(options)
        }

        fetchUsers()
    }, [])

    const selectedLabel = users.find((user) => user.uid === value)?.label

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {selectedLabel || "Select a dancer to give feedback..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search dancer..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    key={user.uid}
                                    value={user.uid}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue)
                                        onSelect(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === user.uid ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {user.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
