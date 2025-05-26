import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
	{
		id: 1,
		title: 'Cổng thông tin bệnh nhân',
		description: 'Quản lý thông tin cá nhân và lịch sử điều trị của bạn',
	},
	{
		id: 2,
		title: 'Quản lý thuốc ARV',
		description: 'Theo dõi lịch uống thuốc và nhận thông báo nhắc nhở',
	},
	{
		id: 3,
		title: 'Kết quả xét nghiệm',
		description: 'Xem kết quả xét nghiệm định kỳ và theo dõi sức khỏe',
	},
	{
		id: 4,
		title: 'Tư vấn trực tuyến',
		description: 'Kết nối với bác sĩ và chuyên gia y tế qua video call',
	},
];

const SystemAccess: React.FC = () => {
	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-white via-primary-50 to-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading">
						Truy cập hệ thống
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Chọn vai trò của bạn để có thể cập nhật thông tin sức khỏe HIV hiệu
						quả
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Bệnh nhân */}
					<div className="card group hover:border hover:border-primary-200">
						<div className="relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-lg p-6">
								<h3 className="font-bold text-xl mb-4 text-center text-primary-700">
									Bệnh nhân
								</h3>
								<div className="space-y-4">
									{features.slice(0, 2).map((feature) => (
										<div key={feature.id} className="flex items-start">
											<CheckCircle2 className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
											<div>
												<h4 className="font-medium text-gray-900">
													{feature.title}
												</h4>
												<p className="text-sm text-gray-600 mt-1">
													{feature.description}
												</p>
											</div>
										</div>
									))}
								</div>
								<Link
									to="/register?role=patient"
									className="mt-6 btn-primary w-full flex justify-center items-center group"
								>
									Đăng ký ngay
									<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>

					{/* Bác sĩ */}
					<div className="card group hover:border hover:border-secondary-200">
						<div className="relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-lg p-6">
								<h3 className="font-bold text-xl mb-4 text-center text-secondary-700">
									Bác sĩ
								</h3>
								<div className="space-y-4">
									{features.slice(2).map((feature) => (
										<div key={feature.id} className="flex items-start">
											<CheckCircle2 className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
											<div>
												<h4 className="font-medium text-gray-900">
													{feature.title}
												</h4>
												<p className="text-sm text-gray-600 mt-1">
													{feature.description}
												</p>
											</div>
										</div>
									))}
								</div>
								<Link
									to="/register?role=doctor"
									className="mt-6 btn-secondary w-full flex justify-center items-center group"
								>
									Tham gia ngay
									<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>

					{/* Nhân viên y tế */}
					<div className="card group hover:border hover:border-accent-200">
						<div className="relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-accent-100 to-primary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-lg p-6">
								<h3 className="font-bold text-xl mb-4 text-center text-accent-700">
									Nhân viên y tế
								</h3>
								<div className="space-y-4">
									{features.slice(1, 3).map((feature) => (
										<div key={feature.id} className="flex items-start">
											<CheckCircle2 className="h-5 w-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
											<div>
												<h4 className="font-medium text-gray-900">
													{feature.title}
												</h4>
												<p className="text-sm text-gray-600 mt-1">
													{feature.description}
												</p>
											</div>
										</div>
									))}
								</div>
								<Link
									to="/register?role=staff"
									className="mt-6 btn-accent w-full flex justify-center items-center group"
								>
									Đăng ký tài khoản
									<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SystemAccess;