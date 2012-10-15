#include "PepperInstance.h"

#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>

#include <cocos2d.h>

#include <ppapi/cpp/url_loader.h>
#include <ppapi/cpp/url_request_info.h>
#include <ppapi/cpp/var.h>
#include <ppapi/gles2/gl2ext_ppapi.h>

#include "platform/nacl/CCPlatformCommon.h"
#include "platform/nacl/native/CCDirectorCaller.h"
#include "CCDirector.h"

#include "AppDelegate.h"



PepperInstance::PepperInstance(PP_Instance instance)
    : pp::Instance(instance)
{
    CC_ASSERT(!cocos2d::CCPlatformCommon::sharedPepperInstance(0));
    cocos2d::CCPlatformCommon::sharedPepperInstance(0) = this;
}

PepperInstance::~PepperInstance()
{
	//glSetCurrentContextPPAPI(context_.pp_resource());
	//glSetCurrentContextPPAPI(0);

	CC_ASSERT(this == cocos2d::CCPlatformCommon::sharedPepperInstance(0));
    cocos2d::CCPlatformCommon::sharedPepperInstance(0) = NULL;
}

bool PepperInstance::Init(uint32_t /* argc */, const char* /* argn */[], const char* /* argv */[])
{
	new AppDelegate();
	cocos2d::CCApplication::sharedApplication()->load(this, "/hge2cc_0/Resources.zip");
	return true;
}

void PepperInstance::HandleMessage(const pp::Var& message)
{
}

void PepperInstance::DidChangeView(const pp::View& view)
{
	cocos2d::CCLog("void PepperInstance::DidChangeView(const pp::View& view)");
	pp::Size size = view.GetRect().size();
	
	if (!cocos2d::CCPlatformCommon::sharedOpenGLContext(0)) {
		new OpenGLContext(this);
		assert(cocos2d::CCPlatformCommon::sharedOpenGLContext());
	}
	
	cocos2d::CCPlatformCommon::sharedOpenGLContext()->InvalidateContext(this);
	cocos2d::CCPlatformCommon::sharedOpenGLContext()->ResizeContext(size);
	if (!cocos2d::CCPlatformCommon::sharedOpenGLContext()->MakeContextCurrent(this))
    {
		cocos2d::CCLog("failed to take the current opengl context");
		CC_ASSERT(false);
    	return;
    }
}
