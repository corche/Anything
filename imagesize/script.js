let uploadedImage = null;

document
	.getElementById("imageInput")
	.addEventListener("change", function (event) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (e) {
			uploadedImage = new Image();
			uploadedImage.src = e.target.result;
			uploadedImage.onload = function () {
				document.getElementById("preview").innerHTML =
					'<img src="' + uploadedImage.src + '" alt="미리보기">';
			};
		};
		reader.readAsDataURL(file);
	});

async function resizeAndZip() {
	if (!uploadedImage) {
		alert("이미지를 먼저 업로드해주세요.");
		return;
	}

	const sizes = document
		.getElementById("sizeInput")
		.value.split(",")
		.map((s) => parseInt(s.trim()))
		.filter((s) => !isNaN(s));

	if (sizes.length === 0) {
		alert("올바른 크기를 입력해주세요.");
		return;
	}

	const zip = new JSZip();

	for (let size of sizes) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = size;
		canvas.height = size;

		ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

		// ⚡ 여기서 png 포맷으로 고정하여 저장
		const blob = await new Promise((resolve) =>
			canvas.toBlob(resolve, "image/png")
		);

		// 파일명도 .png 확장자로 고정
		zip.file(`image_${size}x${size}.png`, blob);
	}

	const content = await zip.generateAsync({ type: "blob" });

	const link = document.createElement("a");
	link.href = URL.createObjectURL(content);
	link.download = "resized_images.zip";
	link.click();
}
