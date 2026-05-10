import { Service } from "typedi";

import { ProfileRepository } from "../repository/profile.repository";
import { StorageService } from "../../../common/services/storage.service";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";

import {
  ProfileResponseDto,
  UpdateProfileRequestDto,
  UploadProfileImageResponseDto,
} from "../dto/profile.dto";

@Service()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storageService: StorageService,
  ) {}

  public async getProfile(userId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    // resolve signed URL only if image key exists in DB
    let profileImageUrl: string | null = null;
    if (profile.profileImageUrl) {
      profileImageUrl = await this.storageService.getSignedFileUrl(
        profile.profileImageUrl,
      );
    }

    return {
      id: profile.id,
      name: profile.user.name,
      email: profile.user.email,
      age: profile.age ?? null,
      gender: profile.gender ?? null,
      height: profile.height ?? null,
      weight: profile.weight ?? null,
      medicalConditions: profile.medicalConditions ?? null,
      fitnessGoal: profile.fitnessGoal ?? null,
      profileImageUrl,
    };
  }

  public async updateProfile(
    userId: number,
    data: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    const updated = await this.profileRepository.updateByUserId(userId, data);

    let profileImageUrl: string | null = null;
    if (updated.profileImageUrl) {
      profileImageUrl = await this.storageService.getSignedFileUrl(
        updated.profileImageUrl,
      );
    }

    return {
      id: updated.id,
      name: updated.user.name,
      email: updated.user.email,
      age: updated.age ?? null,
      gender: updated.gender ?? null,
      height: updated.height ?? null,
      weight: updated.weight ?? null,
      medicalConditions: updated.medicalConditions ?? null,
      fitnessGoal: updated.fitnessGoal ?? null,
      profileImageUrl,
    };
  }

  public async uploadProfileImage(
    userId: number,
    file?: Express.Multer.File, //receive img from multer
  ): Promise<UploadProfileImageResponseDto> {
    if (!file) {
      throw new BadRequestException("Profile image is required");
    }

    // verify B2 is reachable before uploading
    await this.storageService.checkConnection();
    //extract extension=> .png etc
    const extension = file.originalname.split(".").pop();
    const fileName = `profiles/user-${userId}-${Date.now()}.${extension}`; //generate unique file name =>profiles/user-5-17152555.png

    await this.storageService.uploadFile(file, fileName);

    // save S3 key (not the signed URL) to DB
    await this.profileRepository.updateByUserId(userId, {
      profileImageUrl: fileName,
    });

    const profileImageUrl =
      await this.storageService.getSignedFileUrl(fileName);

    return { profileImageUrl };
  }
}
