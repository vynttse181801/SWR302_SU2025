import React from 'react';
import {
	CheckCircle2,
	ArrowRight,
	Shield,
	UserCog,
	Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
	id: number;
	title: string;
	description: string;
}

const features: Feature[] = [
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
		<section className="py-16 md:py-24 relative overflow-hidden">
			{/* Background decorations */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob"></div>
				<div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="text-center mb-16 animate-fade-up">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
						Truy cập hệ thống
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Chọn vai trò của bạn để có thể cập nhật thông tin sức khỏe HIV hiệu
						quả
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Bệnh nhân */}
					<div className="transform hover:scale-[1.02] transition-all duration-300 animate-fade-up">
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100">
								<div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6 mx-auto">
									<Shield className="w-8 h-8 text-primary-600" />
								</div>
								<h3 className="font-bold text-xl mb-4 text-center text-primary-700">
									Bệnh nhân
								</h3>
								<div className="space-y-4">
									{features.slice(0, 2).map((feature) => (
										<div key={feature.id} className="flex items-start group">
											<CheckCircle2 className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0 transform group-hover:scale-110 transition-transform" />
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
									className="mt-8 inline-flex w-full items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:shadow-xl transition-all duration-300 group"
								>
									Đăng ký ngay
									<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>

					{/* Bác sĩ */}
					<div className="transform hover:scale-[1.02] transition-all duration-300 animate-fade-up">
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100">
								<div className="w-14 h-14 rounded-xl bg-secondary-50 flex items-center justify-center mb-6 mx-auto">
									<Stethoscope className="w-8 h-8 text-secondary-600" />
								</div>
								<h3 className="font-bold text-xl mb-4 text-center text-secondary-700">
									Bác sĩ
								</h3>
								<div className="space-y-4">
									{features.slice(2).map((feature) => (
										<div key={feature.id} className="flex items-start group">
											<CheckCircle2 className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0 transform group-hover:scale-110 transition-transform" />
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
									className="mt-8 inline-flex w-full items-center justify-center px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium rounded-lg hover:from-secondary-600 hover:to-secondary-700 transform hover:shadow-xl transition-all duration-300 group"
								>
									Tham gia ngay
									<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>

					{/* Nhân viên y tế */}
					<div className="transform hover:scale-[1.02] transition-all duration-300 animate-fade-up">
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-accent-100 to-primary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
							<div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100">
								<div className="w-14 h-14 rounded-xl bg-accent-50 flex items-center justify-center mb-6 mx-auto">
									<UserCog className="w-8 h-8 text-accent-600" />
								</div>
								<h3 className="font-bold text-xl mb-4 text-center text-accent-700">
									Nhân viên y tế
								</h3>
								<div className="space-y-4">
									{features.slice(1, 3).map((feature) => (
										<div key={feature.id} className="flex items-start group">
											<CheckCircle2 className="h-5 w-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0 transform group-hover:scale-110 transition-transform" />
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
									className="mt-8 inline-flex w-full items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium rounded-lg hover:from-accent-600 hover:to-accent-700 transform hover:shadow-xl transition-all duration-300 group"
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
