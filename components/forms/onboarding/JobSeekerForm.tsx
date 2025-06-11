import Image from 'next/image'
import { jobSeekerSchema } from '@/app/utils/zodSchemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { UploadDropzone } from '@/components/general/UploadThingReExported'
import { useState } from 'react'
import { createJobSeeker } from '@/app/actions'
import PDFImage from '@/public/pdf.png'

export function JobSeekerForm() {
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      about: '',
      name: '',
      resume: '',
    },
  })

  async function onSubmit(data: z.infer<typeof jobSeekerSchema>) {
    try {
      setPending(true)
      await createJobSeeker(data)
    } catch (error) {
      if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
        console.log('Error onSubmit :', error.message)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fir">
                      <Image
                        src={PDFImage}
                        alt="PDF Logo"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 cursor-pointer"
                        onClick={() => {
                          field.onChange('')
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        // field.onChange(res[0].url)
                        if (res?.[0]?.url) {
                          field.onChange(res[0].url)
                        }
                      }}
                      onUploadError={(error) => {
                        console.log('Error :', error.message)
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:cursor-pointer cursor-pointer"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={pending}
        >
          {pending ? 'Submitting...' : 'Continue'}
        </Button>
      </form>
    </Form>
  )
}
