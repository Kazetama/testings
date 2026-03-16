import { Head, Link } from '@inertiajs/react'
import { Calendar, User, Eye, ArrowLeft, Tag as TagIcon, LayoutGrid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/layouts/app-layout'

// Import Quill CSS for generic styling of content
import 'react-quill-new/dist/quill.snow.css'

interface Post {
    id: number
    title: string
    slug: string
    excerpt: string | null
    content: string
    thumbnail: string | null
    views: number
    created_at: string
    meta_title: string | null
    meta_description: string | null
    keywords: string | null
    category?: { id: number, name: string, slug: string }
    author?: { id: number, name: string }
    tags?: { id: number, name: string, slug: string }[]
}

interface Props {
    post: Post
}

export default function Show({ post }: Props) {
    // Generate SEO Meta
    const metaTitle = post.meta_title || post.title
    const metaDesc = post.meta_description || post.excerpt || `Membaca artikel ${post.title} di platform kami.`
    const keywords = post.keywords || `${post.category?.name || 'Blog'}, Artikel, Bacaan`

    return (
        <AppLayout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={keywords} />
                {/* Open Graph Tags for Social Sharing */}
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDesc} />
                {post.thumbnail && <meta property="og:image" content={`/storage/${post.thumbnail}`} />}
                <meta property="og:type" content="article" />
            </Head>

            {/* Back Button & Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Blog
                    </Link>

                    {post.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 hidden sm:flex">
                            <LayoutGrid className="w-4 h-4" />
                            <span>Kategori:</span>
                            <span className="font-semibold text-gray-900">{post.category.name}</span>
                        </div>
                    )}
                </div>
            </div>

            <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <header className="mb-10 text-center">
                     {post.category && (
                        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm uppercase tracking-widest text-blue-700 bg-blue-50 border-blue-200">
                            {post.category.name}
                        </Badge>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold">{post.author?.name || 'Admin'}</span>
                        </div>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.created_at}>
                                {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                            </time>
                        </div>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} views</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.thumbnail && (
                    <div className="mb-14 rounded-3xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200 aspect-video relative">
                        <img
                            src={`/storage/${post.thumbnail}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                    </div>
                )}

                {/* Excerpt (If exists) */}
                {post.excerpt && (
                    <div className="mx-auto max-w-3xl mb-12 p-6 bg-gray-50 border-l-4 border-gray-900 rounded-r-2xl text-xl text-gray-700 italic leading-relaxed text-center shadow-sm">
                        "{post.excerpt}"
                    </div>
                )}

                {/* Main Content */}
                {/* The "ql-editor" class ensures Quill formatting (ul, ol, b, etc.) is applied */}
                <div className="mx-auto max-w-3xl prose prose-lg prose-gray sm:prose-xl lg:prose-2xl marker:text-gray-400 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-img:shadow-md ql-editor">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Footer / Tags */}
                {post.tags && post.tags.length > 0 && (
                    <footer className="mx-auto max-w-3xl mt-16 pt-8 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold uppercase tracking-wider text-sm w-max">
                                <TagIcon className="w-4 h-4" />
                                Tags Topik:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge key={tag.id} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1">
                                        #{tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </footer>
                )}

                <div className="mx-auto max-w-3xl mt-16">
                     <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                             <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ditulis oleh {post.author?.name || 'Admin'}</h3>
                            <p className="text-gray-600">Terima kasih telah membaca konten kami. Bagikan artikel ini jika bermanfaat, dan ikuti kami untuk update terbaru.</p>
                        </div>
                     </div>
                </div>
            </article>
        </AppLayout>
    )
}
