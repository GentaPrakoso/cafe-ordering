-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Bulan Mei 2026 pada 18.47
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_ordering`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `image`) VALUES
(1, 'Coffee', NULL),
(2, 'Non-Coffee', NULL),
(3, 'Food', NULL),
(4, 'Snack', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `menus`
--

INSERT INTO `menus` (`id`, `name`, `description`, `price`, `image`, `category_id`, `available`, `created_at`) VALUES
(1, 'Espresso', 'Kopi hitam pekat', 25000.00, '/images/espresso.jpg', 1, 1, '2026-05-07 15:49:42'),
(2, 'Cappuccino', 'Espresso dengan steamed milk', 35000.00, NULL, 1, 1, '2026-05-07 15:49:42'),
(3, 'Matcha Latte', 'Matcha dengan susu', 40000.00, NULL, 2, 1, '2026-05-07 15:49:42'),
(4, 'Croissant', 'Pastry butter Perancis', 30000.00, NULL, 4, 1, '2026-05-07 15:49:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `table_number` varchar(20) NOT NULL,
  `type` enum('dine_in','take_away') NOT NULL,
  `status` enum('pending_confirmation','processing','cooking','ready','completed','cancelled') DEFAULT 'pending_confirmation',
  `total` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) DEFAULT 0.00,
  `service_charge` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `grand_total` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_name`, `table_number`, `type`, `status`, `total`, `tax`, `service_charge`, `discount`, `grand_total`, `payment_status`, `created_at`) VALUES
(1, 'ORD-20260507-9185', 'Meki', '4990', 'dine_in', 'cancelled', 130000.00, 14300.00, 6500.00, 0.00, 150800.00, 'pending', '2026-05-07 16:39:27'),
(2, 'ORD-20260507-5662', 'Meki', '4990', 'dine_in', 'completed', 130000.00, 14300.00, 6500.00, 0.00, 150800.00, 'pending', '2026-05-07 16:39:32'),
(3, 'ORD-20260507-7898', 'Meki', '2', 'dine_in', 'pending_confirmation', 130000.00, 14300.00, 6500.00, 0.00, 150800.00, 'pending', '2026-05-07 16:39:39'),
(4, 'ORD-20260507-5342', 'Meki', '2', 'dine_in', 'processing', 130000.00, 14300.00, 6500.00, 0.00, 150800.00, 'pending', '2026-05-07 16:40:03'),
(5, 'ORD-20260507-6825', 'Meki', '2', 'dine_in', 'cooking', 130000.00, 14300.00, 6500.00, 0.00, 150800.00, 'pending', '2026-05-07 16:40:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_id`, `quantity`, `notes`, `price`) VALUES
(1, 1, 3, 1, '', 40000.00),
(2, 1, 2, 1, '', 35000.00),
(3, 1, 1, 1, '', 25000.00),
(4, 1, 4, 1, '', 30000.00),
(5, 2, 3, 1, '', 40000.00),
(6, 2, 2, 1, '', 35000.00),
(7, 2, 1, 1, '', 25000.00),
(8, 2, 4, 1, '', 30000.00),
(9, 3, 3, 1, '', 40000.00),
(10, 3, 2, 1, '', 35000.00),
(11, 3, 1, 1, '', 25000.00),
(12, 3, 4, 1, '', 30000.00),
(13, 4, 3, 1, '', 40000.00),
(14, 4, 2, 1, '', 35000.00),
(15, 4, 1, 1, '', 25000.00),
(16, 4, 4, 1, '', 30000.00),
(17, 5, 3, 1, '', 40000.00),
(18, 5, 2, 1, '', 35000.00),
(19, 5, 1, 1, '', 25000.00),
(20, 5, 4, 1, '', 30000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` enum('qris','transfer','ewallet','cash') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `amount` decimal(10,2) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `method`, `transaction_id`, `status`, `amount`, `payload`, `created_at`) VALUES
(1, 5, 'cash', NULL, 'pending', 150800.00, NULL, '2026-05-07 16:40:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','kasir','kitchen','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin Cafe', 'admin@cafe.com', '$2a$10$NuxWCtu0fcGs5fGzE2.t4OTnbp3VjEsXAiKvawPGWK0IGFLVredYq', 'admin', '2026-05-07 15:49:42'),
(2, 'Kasir', 'kasir@cafe.com', '$2a$10$NuxWCtu0fcGs5fGzE2.t4OTnbp3VjEsXAiKvawPGWK0IGFLVredYq', 'kasir', '2026-05-07 15:49:42'),
(3, 'Kitchen', 'kitchen@cafe.com', '$2a$10$NuxWCtu0fcGs5fGzE2.t4OTnbp3VjEsXAiKvawPGWK0IGFLVredYq', 'kitchen', '2026-05-07 15:49:42'),
(4, 'Customer', 'customer@cafe.com', '$2a$10$NuxWCtu0fcGs5fGzE2.t4OTnbp3VjEsXAiKvawPGWK0IGFLVredYq', 'customer', '2026-05-07 15:49:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percent` decimal(5,2) DEFAULT 0.00,
  `discount_nominal` decimal(10,2) DEFAULT 0.00,
  `valid_from` datetime NOT NULL,
  `valid_until` datetime NOT NULL,
  `max_usage` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount_percent`, `discount_nominal`, `valid_from`, `valid_until`, `max_usage`, `used_count`, `created_at`) VALUES
(1, 'WELCOME10', 10.00, 0.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 0, '2026-05-07 15:49:42');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
