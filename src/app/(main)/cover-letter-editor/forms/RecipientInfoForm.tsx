import { EditorFormProps } from '@/lib/types/types'
import { RecipientNameValues, recipientNameSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect } from 'react'
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from '@/lib/utils'

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";

interface RecipientItemProps {
  id: string;
  index: number;
  form: UseFormReturn<RecipientNameValues>;
  remove: (index: number) => void;
}

export default function RecipientInfoForm({
  coverLetterData,
  setCoverLetterData
}:EditorFormProps) {


  const form = useForm<RecipientNameValues>({
    resolver: zodResolver(recipientNameSchema),

    defaultValues: {
      recipientName: coverLetterData.recipientName?.filter(item => item !== undefined) || [],
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "recipientName"
  });

  
  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      const validRecipientNames = values.recipientName
        ?.filter((item): item is NonNullable<typeof item> => item !== undefined)
        .map(item => ({
          recipientName: item.recipientName || "",
          recipientTitle: item.recipientTitle || "",
          companyName: item.companyName || "",
          jobTitle: item.jobTitle || "",
          jobReference: item.jobReference,
        })) || [];

      setCoverLetterData({
        ...coverLetterData,
        recipientName: validRecipientNames,
      });
    });
    return unsubscribe;
  }, [form, coverLetterData, setCoverLetterData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Recipient Information</h2>
      <Form {...form}>
        <form className="space-y-4">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field, index) => (
                <RecipientItem key={field.id} id={field.id} index={index} form={form} remove={remove} />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            type="button"
            onClick={() => append({
              recipientName: "",
              recipientTitle: "",
              companyName: "",
              jobTitle: "",
              jobReference: ""
            })}
          >
            Add Recipient
          </Button>
        </form>
      </Form>
    </div>
  )
}

function RecipientItem({ id, index, form, remove }: RecipientItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "space-y-4 rounded-lg border p-4",
        isDragging ? "bg-secondary" : "bg-background"
      )}
      role="group"
      aria-labelledby={`recipient-${index}-label`}
    >
      <div className="flex justify-between items-center">
        <span id={`recipient-${index}-label`} className="font-semibold">Recipient {index + 1}</span>
        <div {...attributes} {...listeners} className="cursor-grab" aria-label="Drag recipient">
          <GripHorizontal className="h-5 w-5" />
        </div>
      </div>
      <FormField
        control={form.control}
        name={`recipientName.${index}.recipientName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={`recipientName-${index}`}>Recipient Name</FormLabel>
            <FormControl>
              <Input {...field} id={`recipientName-${index}`} placeholder="Enter recipient name" aria-required="true" />
            </FormControl>
            <FormMessage>
              {form.formState.errors.recipientName?.[index]?.recipientName?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`recipientName.${index}.recipientTitle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={`recipientTitle-${index}`}>Recipient Title</FormLabel>
            <FormControl>
              <Input {...field} id={`recipientTitle-${index}`} placeholder="Enter recipient title" aria-required="true" />
            </FormControl>
            <FormMessage>
              {form.formState.errors.recipientName?.[index]?.recipientTitle?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`recipientName.${index}.companyName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={`companyName-${index}`}>Company Name</FormLabel>
            <FormControl>
              <Input {...field} id={`companyName-${index}`} placeholder="Enter company name" aria-required="true" />
            </FormControl>
            <FormMessage>
              {form.formState.errors.recipientName?.[index]?.companyName?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name={`recipientName.${index}.jobReference`}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={`jobReference-${index}`}>Job Reference (Optional)</FormLabel>
            <FormControl>
              <Input {...field} id={`jobReference-${index}`} placeholder="Enter job reference" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button 
        type="button" 
        variant="destructive"
        onClick={() => remove(index)}
        aria-label={`Remove recipient ${index + 1}`}
      >
        Remove
      </Button>
    </div>
  );
}
