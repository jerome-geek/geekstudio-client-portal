import { NextResponse } from 'next/server';
import { listActiveCategories } from '@/entities/trend/api/trend-repo';
import { upsertCategory, deactivateCategory } from '@/entities/trend/api/category-admin';
import { toErrorResponse } from '@/shared/lib/api-error';
import { requireTrendAccess } from '@/shared/lib/trend-auth';

export async function GET() {
  try {
    await requireTrendAccess();
    return NextResponse.json(await listActiveCategories());
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireTrendAccess();
    const body = (await request.json()) as {
      categoryId?: string;
      categoryName?: string;
      fullPath?: string;
      parentCategoryId?: string;
      repKeyword?: string;
    };

    if (!body.categoryId || !body.categoryName) {
      return NextResponse.json({ message: '카테고리 ID와 이름은 필수입니다.' }, { status: 400 });
    }

    const category = await upsertCategory({
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      fullPath: body.fullPath,
      parentCategoryId: body.parentCategoryId,
      repKeyword: body.repKeyword
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireTrendAccess();
    const body = (await request.json()) as { categoryId?: string; active?: boolean };

    if (!body.categoryId || typeof body.active !== 'boolean') {
      return NextResponse.json({ message: 'categoryId와 active가 필요합니다.' }, { status: 400 });
    }

    await deactivateCategory(body.categoryId, body.active);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
