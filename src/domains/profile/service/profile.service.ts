// domains/profile/service/profile.service.ts

import { Service } from "typedi";
import { ProfileRepository } from "../repository/profile.repository";
import { StorageService } from "../../../common/services/storage.service";

import { UploadProfileImageResponseDto } from "../dto/profile.dto";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";

@Service()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storageService: StorageService,
  ) {}

  public async uploadProfileImage(
    userId: number,
    file?: Express.Multer.File,
  ): Promise<UploadProfileImageResponseDto> {
    if (!file) {
      throw new BadRequestException("Profile image is required");
    }

    const extension = file.originalname.split(".").pop();

    const fileName = `profiles/user-${userId}-${Date.now()}.${extension}`;

    await this.storageService.uploadFile(file, fileName);

    await this.profileRepository.updateByUserId(userId, {
      profileImageUrl: fileName,
    });

    const signedUrl = await this.storageService.getSignedFileUrl(fileName);

    return {
      profileImageUrl: signedUrl,
    };
  }
}
