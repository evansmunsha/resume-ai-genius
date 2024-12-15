import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from '@/lib/types/types';
import { AchievementValues, achievementSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import GenerateAchievementButton from "./GenerateAchievementButton";

interface AchievementItemProps {
  id: string;
  index: number;
  form: UseFormReturn<{ achievements: AchievementValues[] }>;
  remove: (index: number) => void;
}

export default function AchievementForm({
  coverLetterData,
  setCoverLetterData
}: EditorFormProps) {
  const form = useForm<{ achievements: AchievementValues[] }>({
    resolver: zodResolver(z.object({
      achievements: z.array(achievementSchema)
    })),
    defaultValues: {
      achievements: coverLetterData.achievements || []
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "achievements"
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      const validAchievements = values.achievements?.filter((achievement): achievement is {
        date: string;
        description: string;
        impact: string;
      } => 
        achievement !== undefined && 
        typeof achievement.date === 'string' &&
        typeof achievement.description === 'string' &&
        typeof achievement.impact === 'string'
      );

      setCoverLetterData({
        ...coverLetterData,
        achievements: validAchievements
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
      <h2 className="text-2xl font-semibold">Achievements</h2>
      <Form {...form}>
        <form className="space-y-4">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field, index) => (
                <AchievementItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            type="button"
            onClick={() => append({
              description: "",
              impact: "",
              date: new Date().toISOString().split('T')[0],
            })}
          >
            Add Achievement
          </Button>
        </form>
      </Form>
    </div>
  );
}

function AchievementItem({ id, index, form, remove }: AchievementItemProps) {
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
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">Achievement {index + 1}</span>
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripHorizontal className="h-5 w-5" />
        </div>
      </div>
      <FormField
        control={form.control}
        name={`achievements.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Describe your achievement" onChange={(e) => field.onChange(e.target.value)} autoFocus/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`achievements.${index}.impact`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impact</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="What was the impact of this achievement?" onChange={(e) => field.onChange(e.target.value)} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`achievements.${index}.date`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="destructive"
          onClick={() => remove(index)}
        >
          Remove
        </Button>
        <GenerateAchievementButton
          achievement={{
            description: form.getValues(`achievements.${index}.description`),
            impact: form.getValues(`achievements.${index}.impact`),
            date: form.getValues(`achievements.${index}.date`)
          }}
          onAchievementGenerated={(achievement) => {
            form.setValue(`achievements.${index}.description`, achievement.description);
            form.setValue(`achievements.${index}.impact`, achievement.impact);
          }}
        />
      </div>
    </div>
  );
} 