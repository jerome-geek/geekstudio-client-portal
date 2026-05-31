import { NextResponse } from 'next/server';
import { uploadTaskAttachment } from '@/entities/task/api/attachments';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

  const attachment = await uploadTaskAttachment(taskId, file);
  return NextResponse.json(attachment, { status: 201 });
}
