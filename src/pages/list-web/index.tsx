import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Globe } from 'lucide-react'


export const ListWebPage = () => {
    const handleNavigate = (url: string) => {
        window.location.href = url
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white rounded-full shadow-lg">
                            <Globe className="h-16 w-16 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Chào mừng bạn đến với hệ thống
                    </h1>
                    <p className="text-xl text-gray-600">
                        Chọn ứng dụng bạn muốn truy cập
                    </p>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            onClick={() => handleNavigate(project.url)}
                        >
                            <CardHeader>
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {project.icon}
                                </div>
                                <CardTitle className="text-2xl mb-2 flex items-center justify-between">
                                    {project.name}
                                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleNavigate(project.url)
                                    }}
                                >
                                    Truy cập
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>© 2025 All rights reserved</p>
                </div>
            </div>
        </div>
    )
}
