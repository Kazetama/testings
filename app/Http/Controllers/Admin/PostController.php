<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/posts/index', [
            'posts' => Post::with(['category', 'author'])->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/posts/create', [
            'categories' => Category::all(),
            'tags' => Tag::all()
        ]);
    }

    public function store(PostRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('posts', 'public');
        }

        $data['slug'] = Str::slug($data['title']);
        $data['user_id'] = $request->user()->id;

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        $tags = $request->input('tags', []);
        unset($data['tags']);

        $post = Post::create($data);
        $post->tags()->sync($tags);

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post created successfully');
    }

    public function edit(Post $post)
    {
        $post->load('tags');

        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => Category::all(),
            'tags' => Tag::all()
        ]);
    }

    public function update(PostRequest $request, Post $post)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {

            if ($post->thumbnail && Storage::disk('public')->exists($post->thumbnail)) {
                Storage::disk('public')->delete($post->thumbnail);
            }

            $data['thumbnail'] = $request->file('thumbnail')->store('posts', 'public');

        } else {
            unset($data['thumbnail']);
        }

        $data['slug'] = Str::slug($data['title']);

        if ($data['status'] === 'published' && $post->status === 'draft') {
            $data['published_at'] = now();
        }

        $tags = $request->input('tags', []);
        unset($data['tags']);

        $post->update($data);
        $post->tags()->sync($tags);

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post updated successfully');
    }

    public function destroy(Post $post)
    {
        if ($post->thumbnail && Storage::disk('public')->exists($post->thumbnail)) {
            Storage::disk('public')->delete($post->thumbnail);
        }

        $post->delete();

        return back()->with('success', 'Post deleted successfully');
    }
}
